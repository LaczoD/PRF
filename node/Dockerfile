FROM node

RUN apt-get -y update
RUN apt-get -y install git
RUN git config --global http.sslVerify false

WORKDIR /opt
RUN git clone https://github.com/ZooLeeCoding/2021-PRF-Sources.git
WORKDIR /opt/2021-PRF-Sources/01intro

RUN npm install

EXPOSE 3000

CMD node index