library(dplyr)
library(readr)
library(jsonlite)

df <- read_csv("L:/Projeto Shiny Coorte/tabela_1_1.csv")
 
df %>% 
  select(-X1) %>% 
  write_json("L:/json-data/tabela_univariada.json")


option_select <- paste0(paste0("<option value=",df %>% 
  group_by(variavel) %>% 
  tally() %>% 
  select(variavel) %>% 
  as.matrix() %>% 
  as.character(), ">Água</option>"), collapse = "\n")

option_select
