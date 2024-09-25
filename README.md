# htmlify

## Convert course content from JSON to HTML (and PDF)

```
npm install
npm run start
```

### Options
```
  --input <PATH>        Path to folder containing input JSON files. (default: "./assets")
  --output-html <PATH>  Path to folder for output HTML files. (default: "./out/html")
  --output-pdf <PATH>   Path to folder for output PDF files. (default: "./out/pdf")
  --clean               Delete content in the output folders before starting.
  --continue            Resume from a failed operation. (Skips regeneration of existing output files.)
  --drop-embedded       Drops EMBEDDED content while converting.
  --drop-iframe         Drops IFRAME content while converting.
  --drop-image          Drops IMAGE content while converting.
  --drop-learning-tool  Drops LEARNING_TOOL content while converting.
  --drop-video          Drops VIDEO content while converting.
  --no-aws-metadata     Skips AWS metadata generation.
  --no-gcp-metadata     Skips GCP metadata generation.
  --no-pdf              Skips PDF generation.
  --split               Split the course content into multiple output files (one per page).
  --text-only           Drop all non-text content while converting.
```