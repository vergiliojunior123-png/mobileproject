import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tarefa, setTarefa] = useState('');
  const [lista, setLista] = useState([]);
  const [carregou, setCarregou] = useState(false);

  useEffect(() => {
    carregarTarefas();
  }, []);

  useEffect(() => {
    if (carregou) {
      salvarTarefas();
    }
  }, [lista, carregou]);

  async function carregarTarefas() {
    try {
      const tarefasSalvas = await AsyncStorage.getItem('@tarefas');

      if (tarefasSalvas) {
        setLista(JSON.parse(tarefasSalvas));
      }

      setCarregou(true);
    } catch (error) {
      console.log('Erro ao carregar:', error);
      setCarregou(true);
    }
  }

  async function salvarTarefas() {
    try {
      await AsyncStorage.setItem('@tarefas', JSON.stringify(lista));
    } catch (error) {
      console.log('Erro ao salvar:', error);
    }
  }

  function adicionarTarefa() {
    if (tarefa.trim() === '') return;

    const novaTarefa = {
      id: Date.now().toString(),
      nome: tarefa
    };

    setLista([...lista, novaTarefa]);
    setTarefa('');
  }

  function removerTarefa(id) {
    setLista(lista.filter(item => item.id !== id));
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