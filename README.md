# Character Records Generator

A web-based character records tool for [Aurora Station](https://aurorastation.org/). Hosted at [c.ily.rs](https://c.ily.rs).

Pick a template and fill in the form. Each section covers a different record. Blank fields are omitted from the output automatically, so no rush to finish everything.

Characters save to your browser. You can also export to a file or generate a share link: the link itself encodes the full set of records, so functionally it's a save file.

Share links let the recipient see a preview of your records, with the option to import the character into their own roster.

This tool is entirely data-driven in XML, and it's already set up for template sharing. A visual template editor is coming soon, so anybody can create their own templates and share them between one another.

For issues, your best chance of getting a reply is to make an issue here, or to ping @llywelwyn in Discord.

Cheers.

## Development

```sh
npm install
npm run dev
```

Build for production:

```sh
npm run build
```

Validate the data files:

```sh
npm run validate
```

Run tests:

```sh
npx vitest run
```

## Where did the old WPF app go?

This used to be a WPF desktop app. The last version of that lives at [`03feee5`](https://github.com/Aurorastation/character-records-generator/tree/03feee572bc7085fd8f9c458490a5dcc642ce689).
