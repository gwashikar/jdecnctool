const chai = require('chai');
const jdecnctool = require('./index');
let expect = chai.expect;

let config = {
    "jdecnctoolServer": "http://localhost:8010",
}

describe("jdecnctool.getNetworkDownloadSpeed", function () {
    this.timeout(50000);

    it("Test 102400 bytes data upload", done => {
        async function getNetworkDownloadSpeed() {
            try {
                jdecnctool.setConfig(config);
                const speed = await jdecnctool.getNetworkDownloadSpeed();
                console.log(JSON.stringify(speed));
                expect(speed).to.include.all.keys('durationms', 'dataSizeInBytes', 'action');
                done();
            } catch (err) {
                console.error(err)
                done(err)
            }
        }
        getNetworkDownloadSpeed();
    });

    it("Test 1024000 bytes data upload", done => {
        async function getNetworkDownloadSpeed() {
            try {
                jdecnctool.setConfig(config);
                const speed = await jdecnctool.getNetworkDownloadSpeed(1024000);
                console.log(JSON.stringify(speed));
                expect(speed).to.include.all.keys('durationms', 'dataSizeInBytes', 'action');
                done();
            } catch (err) {
                console.error(err)
                done(err)
            }
        }
        getNetworkDownloadSpeed();
    });

    it("Test 10240000 bytes data upload", done => {
        async function getNetworkDownloadSpeed() {
            try {
                jdecnctool.setConfig(config);
                const speed = await jdecnctool.getNetworkDownloadSpeed(10240000);
                console.log(JSON.stringify(speed));
                expect(speed).to.include.all.keys('durationms', 'dataSizeInBytes', 'action');
                done();
            } catch (err) {
                console.error(err)
                done(err)
            }
        }
        getNetworkDownloadSpeed();
    });

});

describe("jdecnctool.getNetworkUploadSpeed", function () {
    this.timeout(50000);

    it("Test 102400 bytes data upload", done => {
        let self = this;
        async function getNetworkUploadSpeed() {
            try {
                jdecnctool.setConfig(config);
                const speed = await jdecnctool.getNetworkUploadSpeed();
                console.log(JSON.stringify(speed));
                expect(speed).to.include.all.keys('durationms', 'dataSizeInBytes', 'action');
                done();
            } catch (err) {
                console.error(err)
                done(err)
            }
        }
        getNetworkUploadSpeed();
    });

    it("Test 1024000 bytes data upload", done => {
        let self = this;
        async function getNetworkUploadSpeed() {
            try {
                jdecnctool.setConfig(config);
                const speed = await jdecnctool.getNetworkUploadSpeed(1024000);
                console.log(JSON.stringify(speed));
                expect(speed).to.include.all.keys('durationms', 'dataSizeInBytes', 'action');
                done();
            } catch (err) {
                console.error(err)
                done(err)
            }
        }
        getNetworkUploadSpeed();
    });

    it("Test 10240000 bytes data upload", done => {
        let self = this;
        async function getNetworkUploadSpeed() {
            try {
                jdecnctool.setConfig(config);
                const speed = await jdecnctool.getNetworkUploadSpeed(10240000);
                console.log(JSON.stringify(speed));
                expect(speed).to.include.all.keys('durationms', 'dataSizeInBytes', 'action');
                done();
            } catch (err) {
                console.error(err)
                done(err)
            }
        }
        getNetworkUploadSpeed();
    });


});

