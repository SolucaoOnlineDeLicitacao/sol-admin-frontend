import store   from './store'
import secrets from './secrets'
import events  from './events'


/**
 * Singleton para controle de autenticação.
 *
 * Eventos:
 *   - @auth:expire
 *       Usuário é desautenticado quando token é inválido ou expirou
 *
 *   - @auth:login(user)
 *       Usuário acaba de se autenticar na aplicação
 *
 *   - @auth:logout
 *       Usuário se "desautenticar" da aplicação
 *
 * @type {Object}
 */
const auth = {
  // Authorization: Basic ${clientCredentials}
  clientCredentials: window.btoa(`${secrets.client.id}:${secrets.client.secret}`),

  get user() {
    return store.get('user')
  },

  set user(value) {
    if (!value) return store.remove('user')
    return store.set('user', value)
  },

  get token() {
    return store.get('token')
  },

  set token(value) {
    if (!value) return store.remove('token')
    return store.set('token', value)
  },

  setUser(user) {
    this.user = user
  },

  clear() {
    this.user = null
    this.token = null
    // TODO: devemos limpar o store todo? Cache é de usuário ou de app?
    // store.clearAll()
  },

  /**
   * Limpa dados de usuário com token expirado ou inválido.
   */
  expire() {
    this.clear()

    // Dispara evento para possíveis observers
    events.$emit('auth:expired')
  },

  /**
   * Autentica (registra) o usuário e seu token na aplicação.
   *
   * @param  {Object} user  Dados descritivos do usuário autenticado (ex: e-mail)
   */
  login({ token, user }) {
    this.user = user
    this.token = token
    // Dispara evento para possíveis observers
    events.$emit('auth:login')
  },

  /**
   * Desautentica o usuário atualmente autenticado na aplicação
   */
  logout() {
    this.clear()

    // Dispara evento para possíveis observers
    events.$emit('auth:logout')
  },

  /**
   * Verifica se usuário está autenticado
   */
  isAuthenticated() {
    return !!this.token
  }
}

export default auth
