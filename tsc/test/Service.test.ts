import { expect } from 'chai';
import { Service } from './../src/Core';


describe('ServiceTest', ():void => {

    describe('Listing data', ():void => {

        it('Should list data from defined collection', (done:Function):void => {
            new Service('experience')
                .find()
                .then((experiences:Array<any>) => {
                    expect(experiences.length).to.be.at.least(0);
                })
                .then(() => done());
        });

    });

});