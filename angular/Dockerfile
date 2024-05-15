# Usa un'immagine di Node.js come base
FROM node:18-alpine

# Imposta la directory di lavoro nell'app
WORKDIR /app

# Copia il package.json e il package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze del progetto
RUN npm install -g @angular/cli && npm install

# Copia tutto il codice nell'attuale directory di lavoro nell'immagine
COPY . .

# Compila l'applicazione
RUN ng build

# Espone la porta 4200 all'esterno del contenitore
EXPOSE 4200

# Avvia l'applicazione
CMD ["npm", "start"]
