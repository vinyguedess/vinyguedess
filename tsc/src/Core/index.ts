import * as fs from 'fs';
import * as express from 'express';
import * as pug from 'pug';


export class Bootstrap
{

    private app:express;

    public constructor()
    {
        this.app = express();

        this.prepare(express.static('resources/assets'));

        this.prepare((request, response, next:Function) => {

            response.render = (viewFile:string, variables:any={}, returnCompiled:boolean=false):any => 
            {
                if (viewFile.substr(-4) !== '.pug')
                    viewFile += '.pug';

                if (!fs.existsSync(process.cwd() + `/resources/views/${viewFile}`))
                    throw new Error(`View ${viewFile} não localizada`);

                viewFile = pug.renderFile(process.cwd() + `/resources/views/${viewFile}`, variables);
                if (returnCompiled)
                    return viewFile;

                response.status(200).send(viewFile);
            }

            next();
        });
    }

    public prepare(callback:Function):void
    {
        return this.app.use(callback);
    }

    public get(route:string, callback:Function):void
    {
        return this.app.get(route, callback);
    }

    public listen(port:number=3000, callback:Function=() => console.log(`App running at port ${port}`))
    {
        return this.app.listen(port, callback);
    }

}

export class Service
{

    private collection:string;

    public constructor(collection:string)
    {
        this.collection = collection;
    }

    public find():Promise<Array<any>>
    {
        return new Promise((resolve:Function):void => {

            fs.readFile(process.cwd() + `/data/${this.collection}.json`, (err:Error, bufferedData:Buffer):void => {
                let data:ICollection = JSON.parse(bufferedData.toString());

                resolve(data.data);
            });

        });
    }

    public findByIndex(index:number):Promise<any>
    {
        return this.find()
            .then((lista:Array<any>) => {
                if (lista.length < 1)
                    return null;

                if (typeof lista[index - 1] === 'undefined')
                    return null;

                return lista[index - 1];
            });
    }

}


interface ICollection
{

    name: string;

    data: Array<any>;

}
