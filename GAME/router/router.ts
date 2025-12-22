//router interface to setup router object
export interface Route{
    path: string,
    component: ()=> string,
    onMount?: ()=> void;
}

//router main class
export class Router{
    private routes: Route[] = []
    private rootElement: HTMLElement

    constructor(rootSelector: string){
        const root = document.querySelector(rootSelector)
        if (!root) {
        throw new Error(`Element ${rootSelector} not found`);
        }
        this.rootElement = root as HTMLElement

        window.addEventListener('popstate', ()=>{
            this.loadRoute(window.location.pathname)
        });

        document.addEventListener('click', (e)=>{
            const target = e.target as HTMLElement
            const link = target.closest('a')

            if (link && link.hasAttribute('data-link')){
                e.preventDefault()
                const path = link.getAttribute('href')
                if (path){
                    this.navigate(path);
                }
            }
        });
    }

    //method to add a route to our route object
    addRoute(route: Route): void{
        this.routes.push(route);
    }

    //method to change the url of the page and navigate without charging
    navigate(path: string): void{
        window.history.pushState({}, "", path); //<= we add the "path" to the browser history

        this.loadRoute(path); //load thr crorresponding route
    }

    //methode to load a route (find a route and load the corresponding htnml componemt)
    loadRoute(path: string): void{
        const route = this.routes.find(r=> r.path === path) || this.routes.find(r=> r.path === '/')

        if (route){
            const html = route.component() // route html generation here
            this.rootElement.innerHTML = html

            if (route.onMount){ //if component has onmount funct wait so that the page can fully load before exec the script
                setTimeout(()=> route.onMount!(), 0)
            }
        }
        else{
            this.rootElement.innerHTML = '<h1>404 - Page not found</h1>'
        }
    }

    //router init to display current URL
    init(): void{
        this.loadRoute(window.location.pathname)
    }
}
