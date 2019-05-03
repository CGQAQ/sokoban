#!/bin/bash

pwd=`pwd`

cd "../assets/imgs"

PRE="./../../assets/imgs/"

Type_arr=("Blocks/" "Crates/" "Environment/" "Ground/" "Player/")

TEXT=''

for i in ${Type_arr[@]}; do
    cd "$i"
    content=`ls`
    TEXT="${TEXT}\n// $i start\n"
    for j in $content; do
        TEXT="${TEXT}import $j from \"$PRE$i$j\"\n"
    done
    TEXT="${TEXT}\n// $i end\n\n"
    cd ".."
done

cd $pwd

printf "$TEXT" >a.txt