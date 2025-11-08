FROM elasticsearch:9.2.0
ENV discovery.type=single-node
ENV xpack.security.enabled=false
ENV ES_JAVA_OPTS="-Xms512m -Xmx512m"
EXPOSE 9200 9300


#docker run -d --name es -p 9200:9200 my-elasticsearch 