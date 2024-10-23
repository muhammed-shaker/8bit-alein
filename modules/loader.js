export default class assetsLoader{
    static assets = [];
    static loaded = {};

    static asset(reference, source){
        this.assets.push({reference, source});
    }

    static get(reference){
        return this.loaded[reference];
    }

    static #loadImage(reference, source){
        return new Promise((resolve, reject) =>{
            const image = new Image();
            image.onload = () =>{
                this.loaded[reference] = image;
                resolve();
            };

            image.onerror = () => {
                reject(new Error(`Failed to load image: ${source}`));
            };

            image.src = source;
        });
    }

    static loadAll(){
        const promises = this.assets.map( asset => this.#loadImage(asset.reference, asset.source));
        Promise.all(promises).then(() => {
            if(this.onload){
                this.onload();
            }
        }).catch(error => {
            if(this.onerror){
                this.onerror(error);
            }
        });
    }

    static onload = null;
    static onerror = null;
}