# Description

Simple High Level API over AWS S3 buckets
 
# Usage

```
var Bucket = require('afrostream-node-bucket');

var bucket = new Bucket({name: 'my-bucket'});
bucket.put(buffer, mimeType, path);
```

# API

## bucket.put(buffer, mimeType, path);

@param buffer   Buffer  
@param mimeType string  example: 'image/jpeg'   
@param path     string  
  
path : string {env}, {date}, {rand} will be auto replaced.  

```
bucket.put(buffer, 'image/jpeg', '{env}/cats/{date}/{rand}-toto.jpg')
```
