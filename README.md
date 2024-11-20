# htmlify

## Convert course content from JSON to HTML (and PDF)

```
npm install
npm run start
```

### Options
```
  --cip <CIP>                Content Item Pack ID.
  --discipline <DISCIPLINE>  Course discipline.
  --token <TOKEN>            Authorization bearer token for the Content Service API.
  --output <PATH>            Output path. (default: "./output")
  --continue                 Resume from a failed operation. (Skips regeneration of existing output files.)
  --split                    Split the course content into multiple output files (one per page).
  --no-aws-metadata          Skips AWS metadata generation.
  --no-cache                 Ignores cached CIPs.
  --no-gcp-metadata          Skips GCP metadata generation.
  --no-pdf                   Skips PDF generation.
  --drop-embedded            Drops EMBEDDED content while converting.
  --drop-iframe              Drops IFRAME content while converting.
  --drop-image               Drops IMAGE content while converting.
  --drop-learning-tool       Drops LEARNING_TOOL content while converting.
  --drop-video               Drops VIDEO content while converting.
  --text-only                Drop everything except text content while converting.
```