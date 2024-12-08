import re
import json


def extract_emails(text):
    # Regular expression to match email addresses
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return re.findall(email_pattern, text)


# Read the text file
with open('emails.txt', 'r') as file:
    text = file.read()

# Extract emails
emails = extract_emails(text)

# Convert to JSON
emails_json = json.dumps(emails)

# Print JSON array of emails
print(emails_json)

# Optionally, write to a JSON file
with open('emails.json', 'w') as json_file:
    json.dump(emails, json_file, indent=2)
