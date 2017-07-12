import { Bootstrap, Service } from './Core';

let app = new Bootstrap();

app.get('/', (request, response):void => {

    Promise.all([
        new Service('knowledge').find(),
        new Service('experience').find()
    ])
    .then((resultados:Array<any>):void => {
        let [conhecimentos, experiencias] = resultados;

        response.render('main', {
            conhecimentos: conhecimentos,
            experiencias: experiencias
        });
    });

});

export { app }