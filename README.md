# Welcome to Currency Converter!

Demo application built by using React Router.

## Git pre-commit hook

In order to lint and prettify code I use pre-commit hook. On MacOs you need to run chmod +x .githooks/pre-commit to make it work.

## Features

Main page includes form with input for amount, currency selector, hint with amount converted to USD, button to add conversion to table.
Table displays original amount, amount in desired currency and date on which rate was fetched.
To get rates I use RTK Query that fetches data from Frankfurter API.
RTK requires store so a little store added wrapping main app.

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
