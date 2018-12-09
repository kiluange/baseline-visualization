library(dplyr)
library(readr)
library(jsonlite)

df <- read_csv("C:/Users/sanin/Downloads/tabela_1_1.csv") %>% 
  select(-X1)
 
df %>% 
  write_json("C:/Users/sanin/Documents/tabela_univariada.json")

option_select <- paste0(paste0("<option value=",df %>% 
  group_by(variavel) %>% 
  tally() %>% 
  select(variavel) %>% 
  as.matrix() %>% 
  as.character(), ">Água</option>"), collapse = "\n")

option_select
