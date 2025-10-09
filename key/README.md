# SSL Certificates Directory

Please place your SSL certificates here with these exact filenames:

## Required Files

- `cert.pem` - Your SSL certificate (full chain)
- `key.pem` - Your private key

## Certificate Sources

### Let's Encrypt
If using Let's Encrypt, copy files from:
```bash
sudo cp /etc/letsencrypt/live/pet.xiudoule.com/fullchain.pem ./cert.pem
sudo cp /etc/letsencrypt/live/pet.xiudoule.com/privkey.pem ./key.pem
```

### Custom Certificate Authority
If you have certificates from another CA:
```bash
cp /path/to/your/certificate.pem ./cert.pem
cp /path/to/your/private-key.pem ./key.pem
```

### Self-Signed (Testing Only)
The deployment script will automatically generate self-signed certificates if none are found.

## Security Notes

- Keep private keys secure
- Use appropriate file permissions (600 for private keys)
- Never commit private keys to version control
- Use real certificates for production environments

## Verification

To verify your certificates:
```bash
# Check certificate details
openssl x509 -in cert.pem -text -noout

# Verify private key matches certificate
openssl x509 -noout -modulus -in cert.pem | openssl md5
openssl rsa -noout -modulus -in key.pem | openssl md5
```

The MD5 hashes should match.