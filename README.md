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
  --no-pdf              Skips PDF generation.
  --split               Split the course content into multiple output files (one per page).
```