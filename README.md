### TODOs:

~~0- Complete a working example of the task. Refactor later on.~~

~~1- Retry mechanism for the endpoints returning 500~~

~~2- Integration testing with Nock~~

~~3- Refactor CI setup with GitHub Actions~~

~~4- Maybe instead of basic retry mechanism, we can also demonstrate circuit breakers~~

~~5- Convert it to a CLI that gets the API key as an argument~~

~~6- Add docs for setting up the dev env and running the app (don't forget .nvmrc)~~

~~7- e2e tests for CLI~~

~~8- npm link issue~~

~~9- Invoke integration and e2e tests with separate scripts~~

~~10- General refactoring~~

~~11- Refactor markdown~~

---

### Setup Instructions

1. Copy the [.env.example] file as `.env` file and add your api key for the Outage API.


2. If you are using [nvm], you can run the command below to use the same node version specified in the [.nvmrc] file:

        nvm use


3. Install and build the application:

        npm install
        npm run build

5. To run the application, you have two options. You can either create a symlink and use the CLI directly or you can use the `start` script in the [package.json] file. If you don't provide any additional arguments to the app, it will use the [default values]. Also `-h` argument will print a detailed usage of the app.
    1. To create a symlink, we can use [npm link]. It will look for `bin` property in the [package.json](package.json?plain=1#L46) file and add the corresponding commands to your path. So you can just run:
        
            npm link
            
        And now you can use the CLI with: 
            
           create-outages -h

    2. Or you can use the `start` script. In this option, you need to use `--` characters if you want to pass arguments to the application:

            npm start -- -h


5. While doing changes on the codebase, don't forget to run ```npm run build```. Also [prebuild and postbuild](https://docs.npmjs.com/cli/v8/using-npm/scripts#pre--post-scripts) scripts will update the `dist` folder accordingly.

--- 

### Running the Tests

1. Each test type has its own configuration and a corresponding script in the [package.json](package.json?plain=1#L30~L33) file to run them separately.


2. Unit tests:
    
        npm run test

3. Integration tests:

        npm run test:integration

4. End-to-end tests:

        npm run test:e2e

5. If you want to run all of them at once:

        npm run test:all

---

### Explanation of The Codebase

- [.github/workflows/build.yml]: Simple CI integration with GitHub Actions for running the linter, unit and integration tests.
- [bin/index.ts]: This file is responsible for converting our application into a CLI. It uses [commander] library to achieve this.
- [src/main.ts]: This file is responsible for using the outage service, handling data consistency, making required data transformations and composing all these operations correctly.
- [src/outage.service.ts]: This file is responsible for using the Outage API with an HTTP client. It uses [axios] library to achieve this.
- [test/unit/main.spec.ts]: This file contains unit tests for the [src/main.ts] file and mocks the outage service. For mocking features, it uses [ts-mockito].
- [test/integration/outage.service.spec.ts]: This file contains integration tests for the [src/outage.service.ts] file and uses [nock] for intercepting our HTTP requests and mocking our Outage API, so we don't have to use our real API but still be able to test our HTTP requests.
- [test/e2e/index.spec.ts]: This file tests our application like a real user would with real dependencies. It asserts the `stdout`, `stderr`, and `process code` of our application. It uses [coffee] library to achieve this.

---

### Further Improvement Ideas

- Configure Jest to collect coverage from both unit and integration tests.
- Use a [circuit breaker library](https://github.com/nodeshift/opossum) instead of [simple retry mechanism](https://github.com/softonic/axios-retry) when using the Outage API.
- Single configuration module to combine environment variables, constants and other configuration sources in one place.


[package.json]: package.json "package.json"
[.nvmrc]: .nvmrc ".nvmrc"
[.env.example]: .env.example ".env.example"
[nvm]: https://github.com/nvm-sh/nvm "nvm"
[npm link]: https://docs.npmjs.com/cli/v8/commands/npm-link#synopsis "npm link"
[commander]: https://github.com/tj/commander.js/ "commander"
[bin/index.ts]: bin/index.ts "bin/index.ts"
[.github/workflows/build.yml]: .github/workflows/build.yml ".github/workflows/build.yml"
[src/main.ts]: src/main.ts "src/main.ts"
[src/outage.service.ts]: src/outage.service.ts "src/outage.service.ts"
[axios]: https://github.com/axios/axios "axios"
[ts-mockito]: https://github.com/NagRock/ts-mockito "ts-mockito"
[test/unit/main.spec.ts]: test/unit/main.spec.ts "test/unit/main.spec.ts"
[test/integration/outage.service.spec.ts]: test/integration/outage.service.spec.ts "test/outage/integration/outage.service.spec.ts"
[nock]: https://github.com/nock/nock "nock"
[test/e2e/index.spec.ts]: test/e2e/index.spec.ts "test/e2e/index.spec.ts"
[coffee]: https://github.com/node-modules/coffee "coffee"
[default values]: bin/index.ts?plain=1#L27~L29 "default values"
