# HaveYourContactsBeenPwned
Script searches through your google contacts and runs their emails against known breaches and pastes.

Use on https://script.google.com

## Project discontinued
As of 5th September 2016, this project is discontinued due to rate limiting enforced by the HIBP API, which this tool entirely relies on. The tool would need some tweaks to respect the limit 1 API request per second, but it would be difficult to run in a cloud environment with set execution time as originally intended. Feel free to modify it, it's in JS, so it shouldn't be that hard to just rewrite request function for browser usage.
