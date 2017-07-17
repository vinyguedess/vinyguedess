import { Bootstrap, Service } from './Core';

let app = new Bootstrap();

app.get('/', (request, response):void => {

    Promise.all([
        new Service('seo').findByIndex(1),
        new Service('knowledge').find(),
        new Service('experience').find()
    ])
    .then((resultados:Array<any>):void => {
        let [seo, conhecimentos, experiencias] = resultados;

        seo.getFormattedKeyWords = () => seo.keywords.join(', ');

        response.render('main', {
            seo: seo,
            conhecimentos: conhecimentos,
            experiencias: experiencias
        });
    });

});

export { app }