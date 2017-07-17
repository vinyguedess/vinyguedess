import * as fs from 'fs';
import { ncp } from 'ncp';
import { get } from 'request';
import { app } from './src/app';


const outDir = process.cwd() + '/out';


const copiarAssets = () => {
    let dependencias = [
            process.cwd() + '/resources/assets'
        ];

    return Promise.all(
        dependencias.map((dependencia:string):Promise<boolean> => {
            return new Promise(
                (resolve:Function) => ncp(
                    dependencia, outDir, (err:Error):void => err ? resolve(false) : resolve(true)
                )
            )
        })
    );
}


const criarSinglePage = () => {
    let data:string = null,
        server = app.listen(3000);

    return new Promise((resolve:Function) => {
        get('http://localhost:3000/')
        .on('data', (bufferedData:Buffer) => data = bufferedData.toString())
        .on('end', () => {
            server.close()

            resolve(data);    
        });
    })
    .then((data:string):Promise<boolean> => {
        data = data
            .replace(/\"\//g, '"\./')
            .replace(/\(\//g, '(./');

        return new Promise((resolve:Function) => {
            fs.writeFile(`${outDir}/index.html`, data, (err:Error) => {
                if (err)
                    return resolve(false);

                resolve(true);
            });
        })
    })
}


fs.mkdir(outDir, (err:Error):void => {
    Promise.all([
        copiarAssets(),
        criarSinglePage()
    ])
});
