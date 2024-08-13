-- Custom SQL migration file, put you code below! --
-- accidently added .json to the book names, this will remove it --
update `egw` set book = replace(book, '.json', '');