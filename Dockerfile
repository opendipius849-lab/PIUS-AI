FROM node:lts-buster

# git clone karne ke liye pehle 'git' install karna zaroori hai
RUN apt-get update && apt-get install -y git

# Aapke kehne par, hum git clone istemal kar rahe hain
RUN git clone https://github.com/Qadeer-Xtech/QADEER-AI /root/pkqadeer

WORKDIR /root/pkqadeer

# Dependencies install karein
RUN npm install && npm install -g pm2

# Yahan se COPY . . wali line hata di gayi hai kyunki uski zaroorat nahi

EXPOSE 9090

CMD ["npm", "start"]
