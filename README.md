## Estructura
```
/image-filters
   |--assets | Bibliotecas y componentes para la GUI.
   |--index.html | Estructura de GUI.
   |--main.js | Rutinas para control de ventana nativa.
   |--preload.js | Encapsulamiento de programa.
   |--renderer.js | Rutinas para control de GUI.
   |--filters.js | Todos los filtros disponibles.
   |--package.json | Gestión de paquetes para Node.js.
   |--README.md | Este README.
```

## Pasos para ejecutar código fuente (cualquier plataforma).

Requisitos:

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable) (opcional)

```bash
$ git clone https://github.com/JCastrejonE/image-filters.git & cd image-filters
$ npm install or $ yarn install
$ npm start
```

Para generar el ejecutable empaquetado (sólo Windows):

```bash
$ npm run dist
```

El ejecutable portable se encuentra en `./dist/FiltrosPDI x.x.x.exe`
