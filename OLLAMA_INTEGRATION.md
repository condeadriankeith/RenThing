# Ollama Integration for RenThing AI Assistant

This document explains how to set up and use Ollama as a locally hosted AI model for the RenThing platform.

## Overview

Ollama integration provides a way to run the AI assistant locally. This approach offers several benefits:

- **Privacy**: All data stays on your local machine
- **Cost**: No API costs since you're hosting the model yourself
- **Control**: Full control over the model and its responses
- **Offline capability**: Works without an internet connection

## Prerequisites

1. [Ollama](https://ollama.com/) installed on your machine
2. The Llama 3.1 8B model pulled locally

## Setup Instructions

### 1. Install Ollama

Follow the installation instructions on the [Ollama website](https://ollama.com/).

### 2. Pull the Llama 3.1 8B Model

```bash
ollama pull llama3.1:8b
```

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Ollama Configuration for local AI model
OLLAMA_ENABLED=true
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

### 4. Start the Development Server

```bash
pnpm dev
```

## How It Works

The AI service in RenThing uses your locally hosted Llama 3.1 8B model when Ollama is enabled.

## Configuration Options

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `OLLAMA_ENABLED` | Enable/disable Ollama integration | `false` |
| `OLLAMA_HOST` | Ollama API endpoint | `http://localhost:11434` |
| `OLLAMA_MODEL` | Model name to use | `llama3.1:8b` |

## Production Considerations

For production deployments, it's recommended to:

1. Ensure proper error handling and monitoring
2. Consider the performance implications of running large models locally

## Troubleshooting

### Model Not Found

If you get an error about the model not being found, ensure you've pulled it:

```bash
ollama pull llama3.1:8b
```

### Connection Issues

If the application can't connect to Ollama:

1. Verify Ollama is running: `ollama list`
2. Check the `OLLAMA_HOST` setting matches your Ollama endpoint
3. Ensure no firewall is blocking the connection

### Performance Issues

Large language models require significant resources:

1. Ensure your machine has sufficient RAM (16GB+ recommended)
2. Consider using a smaller model if performance is an issue
3. Monitor CPU/GPU usage during AI processing

## Testing the Integration

You can test the Ollama integration using the test script:

```bash
npx ts-node test-ollama.ts
```

This will send a test message to the AI service and display the response.