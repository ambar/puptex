#!/bin/bash
formats=(svg json)
short='E=mc^2'
long='f(x)=\sum^{\infty}_{n=0}\frac{f^{(n)}(a)}{n!}(x-a)^n'
unicode='A%3D%5C%7Bx%7Cx%5Cleq%200%2Cx~%5Ctext%7B%E4%B8%BA%E6%9C%89%E7%90%86%E6%95%B0%7D%5C%7D%5Ccup%5C%7Bx%7Cx%3E0~%5Cmbox%7B%E4%B8%94%7D~x%5E2%3C2%2Cx~%5Ctext%7B%E4%B8%BA%E6%9C%89%E7%90%86%E6%95%B0%7D%5C%7D'
SCRIPT_DIR=$(cd $(dirname $0) && pwd);
for format in "${formats[@]}"
do
  ab -n 100 -c 8 localhost:11010/$format?q=$short > $SCRIPT_DIR/../doc/perfs/$format-short.txt
  ab -n 100 -c 8 localhost:11010/$format?q=$long > $SCRIPT_DIR/../doc/perfs/$format-long.txt
  ab -n 100 -c 8 localhost:11010/$format?q=$unicode > $SCRIPT_DIR/../doc/perfs/$format-unicode.txt
done
