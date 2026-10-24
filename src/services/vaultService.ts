/**
 * vaultService.ts
 * Client-Side In-Memory AES-256-GCM Decryption Service
 * 
 * Secure zero-knowledge static hosting:
 * Encrypted photo blobs (.enc) are fetched over HTTPS, decrypted directly
 * in browser memory using Web Crypto API (crypto.subtle), and converted to
 * ephemeral blob URLs. Plaintext photos never touch the disk or Git repository.
 */

export interface VaultPhoto {
  id: string;
  file: string;
  width: number;
  height: number;
  aspectRatio: number;
  caption: string;
}

class VaultService {
  private passcode: string = '2710';
  private photos: VaultPhoto[] = [];
  private blobCache: Map<string, string> = new Map();
  private pendingDecryptions: Map<string, Promise<string>> = new Map();
  private isLoaded: boolean = false;

  /**
   * Set passcode and pre-load manifest
   */
  async init(passcode: string = '2710'): Promise<VaultPhoto[]> {
    this.passcode = passcode;
    try {
      const res = await fetch('/vault/manifest.json');
      if (res.ok) {
        this.photos = await res.json();
        this.isLoaded = true;
      }
    } catch (e) {
      console.warn('Vault manifest fetch failed or not yet generated:', e);
    }
    return this.photos;
  }

  isReady(): boolean {
    return this.isLoaded && this.photos.length > 0;
  }

  getPhotos(): VaultPhoto[] {
    return this.photos;
  }

  getPasscode(): string {
    return this.passcode;
  }

  setPasscode(code: string) {
    this.passcode = code;
  }

  /**
   * Synchronously get cached blob URL if already decrypted
   */
  getCachedUrl(fileUrl: string): string | undefined {
    return this.blobCache.get(fileUrl);
  }

  /**
   * Decrypts an encrypted .enc file from /vault/photos/ into an in-memory Object URL
   */
  async getDecryptedUrl(fileUrl: string): Promise<string> {
    // 1. Check memory cache
    const cached = this.blobCache.get(fileUrl);
    if (cached) return cached;

    // 2. Prevent duplicate concurrent requests for the same file
    const pending = this.pendingDecryptions.get(fileUrl);
    if (pending) return pending;

    const decryptPromise = (async () => {
      try {
        const res = await fetch(fileUrl);
        if (!res.ok) {
          throw new Error(`Failed to fetch encrypted photo: ${res.statusText}`);
        }

        const arrayBuffer = await res.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        if (buffer.length < 28 + 16) {
          throw new Error('Invalid encrypted payload: buffer too short');
        }

        // Layout: [0..15] Salt (16B), [16..27] IV (12B), [28..end] Ciphertext + Tag
        const salt = buffer.subarray(0, 16);
        const iv = buffer.subarray(16, 28);
        const ciphertextAndTag = buffer.subarray(28);

        // Derive AES-256-GCM key from passcode using PBKDF2
        const enc = new TextEncoder();
        const passwordBytes = enc.encode(this.passcode || '2710');

        const baseKey = await crypto.subtle.importKey(
          'raw',
          passwordBytes,
          { name: 'PBKDF2' },
          false,
          ['deriveKey']
        );

        const aesKey = await crypto.subtle.deriveKey(
          {
            name: 'PBKDF2',
            salt,
            iterations: 100000,
            hash: 'SHA-256',
          },
          baseKey,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );

        // Decrypt with Web Crypto
        const decryptedBuffer = await crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          aesKey,
          ciphertextAndTag
        );

        // Convert decrypted binary to Blob URL
        const blob = new Blob([decryptedBuffer], { type: 'image/jpeg' });
        const blobUrl = URL.createObjectURL(blob);

        this.blobCache.set(fileUrl, blobUrl);
        return blobUrl;
      } catch (err) {
        console.error(`Decryption failed for ${fileUrl}:`, err);
        throw err;
      } finally {
        this.pendingDecryptions.delete(fileUrl);
      }
    })();

    this.pendingDecryptions.set(fileUrl, decryptPromise);
    return decryptPromise;
  }

  /**
   * Preload a batch of photos into memory
   */
  async preloadBatch(fileUrls: string[]): Promise<string[]> {
    return Promise.all(fileUrls.map((url) => this.getDecryptedUrl(url)));
  }

  /**
   * Clean up all object URLs to release memory
   */
  cleanup() {
    this.blobCache.forEach((url) => URL.revokeObjectURL(url));
    this.blobCache.clear();
  }
}

export const vaultService = new VaultService();
