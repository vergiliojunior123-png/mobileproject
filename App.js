import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE = '@tarefas';

export default function App() {
  const [tarefa, setTarefa] = useState('');
  const [lista, setLista] = useState([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    carregarTarefas();
  }, []);

  useEffect(() => {
    if (carregado) {
      salvarTarefas(lista);
    }
  }, [lista, carregado]);

  async function carregarTarefas() {
    try {
      let dados = null;

      if (Platform.OS === 'web') {
        dados = localStorage.getItem(CHAVE);
      } else {
        dados = await AsyncStorage.getItem(CHAVE);
      }

      if (dados) {
        setLista(JSON.parse(dados));
      }

      setCarregado(true);
    } catch (error) {
      console.log('Erro ao carregar tarefas:', error);
      setCarregado(true);
    }
  }

  async function salvarTarefas(novaLista) {
    try {
      const dados = JSON.stringify(novaLista);

      if (Platform.OS === 'web') {
        localStorage.setItem(CHAVE, dados);
      } else {
        await AsyncStorage.setItem(CHAVE, dados);
      }
    } catch (error) {
      console.log('Erro ao salvar tarefas:', error);
    }
  }

  function adicionarTarefa() {
    if (tarefa.trim() === '') {
      alert('Digite uma tarefa!');
      return;
    }

    const novaTarefa = {
      id: Date.now().toString(),
      nome: tarefa
    };

    setLista([...lista, novaTarefa]);
    setTarefa('');
  }

  function removerTarefa(id) {
    const novaLista = lista.filter(item => item.id !== id);
    setLista(novaLista);
  }

  function limparTudo() {
    setLista([]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Tarefas</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite uma tarefa"
        value={tarefa}
        onChangeText={setTarefa}
      />

      <TouchableOpacity style={styles.botao} onPress={adicionarTarefa}>
        <Text style={styles.textoBotao}>Adicionar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoLimpar} onPress={limparTudo}>
        <Text style={styles.textoBotao}>Limpar Tudo</Text>
      </TouchableOpacity>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.textoItem}>{item.nome}</Text>

            <TouchableOpacity
              style={styles.botaoExcluir}
              onPress={() => removerTarefa(item.id)}
            >
              <Text style={styles.textoExcluir}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    backgroundColor: '#f2f2f2'
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8
  },
  botao: {
    backgroundColor: '#007AFF',
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  botaoLimpar: {
    backgroundColor: '#555',
    marginTop: 10,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  item: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textoItem: {
    fontSize: 18
  },
  botaoExcluir: {
    backgroundColor: 'red',
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoExcluir: {
    color: '#fff',
    fontWeight: 'bold'
  }
});