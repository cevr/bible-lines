-- Custom SQL migration file, put you code below! --
CREATE INDEX verses_embedding_idx ON verses ( libsql_vector_idx(embedding, 'metric=cosine') );
