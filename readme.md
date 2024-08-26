# Logseq AI Assistant - no code commited post fork as yet

## Features
- Seamless integration with Logseq
- Customizable prompt support
- Easy-to-use built-in prompts 
- Using a custom Open AI basePath

## Install

- turn on Logseq developer mode
- build the package
- unzip the zip file and load from Logseq plugins page

## Configuration
Before using the plugin, you need to configure it according to your preferences.

- **API Key**: Enter your RAGflow API key.

## How to Use a Custom Prompt

- Open the plugin settings and locate "customPrompts" field.

- Add the following JSON object to the "prompts" array:

```json
{
  "apiKey": "<your-api-key>",
  "model": "gpt-3.5-turbo",
  "customPrompts": {
    "enable": true, // <- Make sure to enable this.
    "prompts": [
      {
        "name": "Markdown Table",
        "prompt": "Please generate a {{text}} Markdown table",
        "output": "replace" // "property", "replace" or "insert"
      }
    ]
  },
  "disabled": false
}
```

- In the Logseq editor, focus the cursor on the place where you want to generate the table and do the following.
![](https://user-images.githubusercontent.com/9718515/226259576-a1193b51-8a57-4cad-9270-f5bc30a5ba29.gif)

## Contribution
Issues and PRs are welcome!

## Licence
MIT
