export default class assetsLoader{
    constructor(){
        this.assets = [];
        this.loaded = {};
    }

    asset(reference, source){
        this.assets.push({reference, source});
    }

    get(reference){
        return this.loaded[reference];
    }

    #loadImage(reference, source){
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

    loadAll(){
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

    onload = null;
    onerror = null;
}