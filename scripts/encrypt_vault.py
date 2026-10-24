#!/usr/bin/env python3
"""
encrypt_vault.py - Privacy-First Image Optimizer & AES-256-GCM Encryptor

Reads personal images from 'public/images/mine/', optimizes them (EXIF stripped,
auto-oriented, resized to max 1280px, compressed to web JPEG), and encrypts each
file using AES-256-GCM derived via PBKDF2 with the user's Passcode (default '2710').

Output:
  public/vault/photos/photo_XXX.enc  (Encrypted binary files)
  public/vault/manifest.json         (Index metadata)

Format of each .enc file:
  [0..15]   : 16-byte random Salt
  [16..27]  : 12-byte random IV/Nonce
  [28..end] : Ciphertext + 16-byte AES-GCM Auth Tag
"""

import os
import sys
import io
import json
import glob
from PIL import Image, ImageOps
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

PASSCODE = os.environ.get('VAULT_PASSCODE', '2710').encode('utf-8')
INPUT_DIR = 'public/images/mine'
OUTPUT_DIR = 'public/vault/photos'
MANIFEST_FILE = 'public/vault/manifest.json'
MAX_DIMENSION = 1280
JPEG_QUALITY = 82
PBKDF2_ITERATIONS = 100000

def main():
    if not os.path.exists(INPUT_DIR):
        print(f"Error: {INPUT_DIR} does not exist.")
        sys.exit(1)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Gather image files
    valid_exts = ('.jpg', '.jpeg', '.png', '.webp')
    files = [
        f for f in sorted(os.listdir(INPUT_DIR))
        if f.lower().endswith(valid_exts)
    ]

    if not files:
        print(f"No image files found in {INPUT_DIR}")
        sys.exit(1)

    print(f"Found {len(files)} personal images in {INPUT_DIR}")
    print(f"Optimizing, stripping EXIF/GPS, and encrypting with AES-256-GCM (Passcode: '2710')...")

    manifest = []
    total_orig_size = 0
    total_enc_size = 0

    for idx, fname in enumerate(files, 1):
        in_path = os.path.join(INPUT_DIR, fname)
        orig_size = os.path.getsize(in_path)
        total_orig_size += orig_size

        try:
            with Image.open(in_path) as im:
                # 1. Auto-transpose orientation from EXIF
                im = ImageOps.exif_transpose(im)

                # 2. Convert to RGB (handles RGBA / CMYK)
                if im.mode in ('RGBA', 'LA', 'P'):
                    bg = Image.new('RGB', im.size, (255, 255, 255))
                    if im.mode == 'P':
                        im = im.convert('RGBA')
                    bg.paste(im, mask=im.split()[-1] if im.mode in ('RGBA', 'LA') else None)
                    im = bg
                elif im.mode != 'RGB':
                    im = im.convert('RGB')

                # 3. Resize to max dimension while preserving aspect ratio
                im.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
                w, h = im.size
                aspect_ratio = round(w / h, 3)

                # 4. Save to in-memory JPEG buffer with NO EXIF metadata (cleans GPS/hardware info)
                buf = io.BytesIO()
                im.save(buf, format='JPEG', quality=JPEG_QUALITY, optimize=True)
                plaintext_bytes = buf.getvalue()

            # 5. Encrypt with AES-256-GCM
            salt = os.urandom(16)
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=PBKDF2_ITERATIONS,
            )
            key = kdf.derive(PASSCODE)
            nonce = os.urandom(12)
            aesgcm = AESGCM(key)
            ciphertext_and_tag = aesgcm.encrypt(nonce, plaintext_bytes, None)

            # 6. Write binary package: salt (16B) + nonce (12B) + ciphertext + tag
            out_filename = f"photo_{idx:03d}.enc"
            out_path = os.path.join(OUTPUT_DIR, out_filename)
            payload = salt + nonce + ciphertext_and_tag

            with open(out_path, 'wb') as out_f:
                out_f.write(payload)

            enc_size = len(payload)
            total_enc_size += enc_size

            photo_entry = {
                "id": f"photo_{idx:03d}",
                "file": f"/vault/photos/{out_filename}",
                "width": w,
                "height": h,
                "aspectRatio": aspect_ratio,
                "caption": f"Memory #{idx}",
            }
            manifest.append(photo_entry)

            if idx % 10 == 0 or idx == len(files):
                print(f"  [{idx}/{len(files)}] Processed & encrypted -> {out_filename} ({enc_size // 1024} KB)")

        except Exception as e:
            print(f"Error processing {fname}: {e}")

    # Write manifest
    with open(MANIFEST_FILE, 'w') as mf:
        json.dump(manifest, mf, indent=2)

    print("\n" + "=" * 50)
    print("ENCRYPTION COMPLETED SUCCESSFULLY!")
    print(f"Total Images: {len(manifest)}")
    print(f"Original Size: {total_orig_size / (1024 * 1024):.1f} MB")
    print(f"Encrypted Size: {total_enc_size / (1024 * 1024):.1f} MB ({(1 - total_enc_size / total_orig_size) * 100:.1f}% reduction)")
    print(f"Manifest written to: {MANIFEST_FILE}")
    print("=" * 50)

if __name__ == '__main__':
    main()
