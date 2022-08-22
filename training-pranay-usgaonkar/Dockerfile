FROM 403893040935.dkr.ecr.us-east-1.amazonaws.com/onerequest_marketing_web:node14

WORKDIR /usr/src/app

COPY . .

RUN npm install --unsafe-perm

RUN echo $build_parameter

RUN npm run $build_parameter

EXPOSE 3333