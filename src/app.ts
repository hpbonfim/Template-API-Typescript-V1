import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import Path = require('path');
import errorHandler = require('errorhandler');
import DATABASE from "./database/db";

@ServerSettings({
    acceptMimes: ["application/json"],
    httpsPort: false
})
export class Server extends ServerLoader {
    ENV = process.env.NODE_ENV || 'development';

    constructor() {
        super();

        const rootDir: string = Path.resolve(__dirname);
        const PORT = process.env.PORT || 3003;
        const dotenv = require('dotenv');

        // Load environment variables from .env file, where API keys and passwords are configured
        dotenv.config({path: '.env'});

        this.mount(
            "/api/",
            Path.join(rootDir, '..', 'build', '/controllers/**/*.js')
        )
            .createHttpServer(PORT);
    }

    /**
     * This method let you configure .
     * @returns {Promise<any>}
     */

    public $beforeInit(): void | Promise<any> {
        const db = DATABASE();

    }

    /**
     * This method let you configure the middleware required by your application to works.
     * @returns {Server}
     */
    public $beforeRoutesInit(): void | Promise<any> {
        const cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser'),
            compress = require('compression'),
            methodOverride = require('method-override');

        this
            .use(GlobalAcceptMimesMiddleware)
            .use(cookieParser())
            .use(compress({}))
            .use(methodOverride())
            .use(bodyParser.json())
            .use(bodyParser.urlencoded({
                extended: true
            }));

        /**
         * Error Handler. Provides full stack - remove for production
         */
        if (this.ENV !== 'production') {
            this.use(errorHandler());
        }
    }

    public $onReady() {
        console.log('Server started...');
    }

}

const server = new Server();
server.start();

process.on('SIGHUP', () => {
    console.log('Bye bye!');
    process.exit();
});