'use strict';

import {Controller, Get} from "@tsed/common";

@Controller('example')
class ExampleController {

    constructor() {}

    @Get('/')
    async getData() {
        return ('it\'s alive!');
    }
}


export default ExampleController;