library(dplyr)
library(readr)
library(jsonlite)

df <- read_csv("C:/Users/sanin/Downloads/tabela_1_1.csv") %>% 
  select(-X1)

estados <- df %>% 
  filter(variavel == "cod_sexo_pessoa_eq") %>% 
  group_by(cod_munic_ibge_2_fam_eq) %>% 
  summarise(n = sum(n))

levels = c(11:17, 21:29, 31:33, 35, 41:43, 50:53, 0)
labels = c("RO", "AC", 'AM', 'RR', 'PA','AP','TO',
           'MA', 'PI', 'CE', 'RN', 'PB', 'PE', 'AL', 'SE', 'BA',
           'MG', 'ES', 'RJ', 'SP',
           'PR', 'SC','RS',
           'MS', 'MT','GO', 'DF', "NA")

df %>% 
  mutate(cod_munic_ibge_2_fam_eq = factor(cod_munic_ibge_2_fam_eq, levels = levels,
                                          labels = labels)) %>% 
  write_json("C:/Users/sanin/Documents/tabela_univariada.json")

estados %>% 
  mutate(key = factor(cod_munic_ibge_2_fam_eq, levels = levels,
                                          labels = labels),
         denom = n) %>%
  select(-cod_munic_ibge_2_fam_eq, -n) %>% 
  write_json("C:/Users/sanin/Documents/estados.json")

