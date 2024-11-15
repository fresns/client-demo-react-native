import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useAppStore } from './App.store'
import { ModalMessageElement } from './src/components/message/modal-message'
import { ToastMessageElement } from './src/components/message/toast-message'
import { Router } from './src/router/router'

const App = observer(() => {
  const { store } = useAppStore()

  useEffect(() => {
    store.init()
    return () => store.reset()
  }, [])

  if (store.data.isLoading) {
    return null
  }

  return (
    <View style={styles.container}>
      <Router/>
      <ToastMessageElement/>
      <ModalMessageElement/>
    </View>
  )
})

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
