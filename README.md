<p align="center"><a href="https://fresns.org" target="_blank"><img src="https://assets.fresns.com/images/logos/fresns.png" width="300"></a></p>

<p align="center">
<img src="https://img.shields.io/packagist/dependency-v/fresns/fresns/php" alt="PHP">
<img src="https://img.shields.io/github/v/release/fresns/fresns?color=orange" alt="Fresns">
<img src="https://img.shields.io/github/license/fresns/fresns" alt="License">
</p>

## About Fresns

Fresns is a free and open source social network service software, a general-purpose community product designed for cross-platform, and supports flexible and diverse content forms. It conforms to the trend of the times, satisfies a variety of operating scenarios, is more open and easier to re-development.

- Database support `MySQL`, `MariaDB`, `PostgreSQL`, `SQL Server`, `SQLite`
- [Click to discover the 16 features of Fresns](https://fresns.org/intro/features.html)
- Users should read the [installation](https://fresns.org/guide/install.html) and [operating](https://fresns.org/intro/operating.html) documentation.
- Extensions developers should read the [extension documentation](https://docs.fresns.com/open-source/) and [database structure](https://docs.fresns.com/open-source/database/).
- For client developers (web or app), please read the [API reference](https://docs.fresns.com/clients/api/) documentation.

## Framework

This application is developed utilizing the Fresns API and crafted with the React Native framework. It boasts a pristine and streamlined architecture, ensuring complete decoupling. During subsequent development phases, there is no need to concern oneself with compatibility or conflict issues when incorporating third-party services or styling libraries, as no additional elements are integrated or bound within the codebase. This design choice significantly facilitates a more convenient and seamless secondary development process.

## Instructions for use

Duplicate the `env.example.js` file from the `/sdk/` directory into the root directory, renaming it to `env.js`. Then, populate your configuration details ([public key](https://docs.fresns.com/clients/sdk/#api-key)) as specified within the file.

## Contributing

Thank you for considering contributing to the Fresns core library! The contribution guide can be found in the [Fresns documentation](https://fresns.org/community/join.html).

## Code of Conduct

In order to ensure that the Fresns community is welcoming to all, please review and abide by the [Code of Conduct](https://fresns.org/community/join.html#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Fresns, please send an e-mail to Taylor Otwell via [support@fresns.org](mailto:support@fresns.org). All security vulnerabilities will be promptly addressed.

## License

Fresns is open-sourced software licensed under the [Apache-2.0 license](https://github.com/fresns/fresns/blob/main/LICENSE).
