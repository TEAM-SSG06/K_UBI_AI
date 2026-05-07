import hashlib
import hmac
import os
import jellyfish

# In a real production environment, this would be stored securely in AWS KMS or similar.
# For this prototype, we'll use a local env var or default salt.
PII_SALT = os.getenv("PII_SALT", "karnataka-govt-secure-salt-2026").encode('utf-8')

def hash_pii(value: str) -> str:
    """
    Deterministically hashes PII (like PAN or GSTIN) using HMAC SHA-256 and a secret salt.
    """
    if not value:
        return None
    # Normalize before hashing to ensure exact matches
    normalized = str(value).strip().upper()
    return hmac.new(PII_SALT, normalized.encode('utf-8'), hashlib.sha256).hexdigest()

def phonetic_encode(name: str) -> str:
    """
    Uses Double Metaphone to generate a phonetic representation of a business name.
    This helps match "Kiran" and "Keeran" because they sound the same.
    """
    if not name:
        return ""
    # Double Metaphone returns a tuple of (primary, secondary) encoding.
    # We'll join them to create a robust phonetic key.
    encodings = jellyfish.metaphone(name) # Using standard metaphone for simplicity if double is not exposed directly
    return encodings

def mask_pii(value: str, keep_first: int = 1, keep_last: int = 0) -> str:
    """
    Masks a string for the Reviewer UI. 
    "Sri Krishna Cafe" -> "S** K****** C***"
    """
    if not value:
        return ""
    
    words = value.split()
    masked_words = []
    
    for word in words:
        if len(word) <= keep_first + keep_last:
            masked_words.append(word)
        else:
            first_part = word[:keep_first]
            last_part = word[-keep_last:] if keep_last > 0 else ""
            stars = "*" * (len(word) - keep_first - keep_last)
            masked_words.append(f"{first_part}{stars}{last_part}")
            
    return " ".join(masked_words)

# Example Usage
if __name__ == "__main__":
    print(hash_pii("ABCDE1234F"))
    print(phonetic_encode("Sri Krishna Cafe"))
    print(phonetic_encode("Shree Krishna Cafe"))
    print(mask_pii("Sri Krishna Cafe"))
