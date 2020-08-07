import store from './store'

/**
 * Singleton para controle de politicas de acesso.
 *
 * @type {Object}
 */
const ability = {

  get user() {
    return store.get('user')
  },
  
  isGeneral() {
    return this.user['role'] == 'general'
  },

  rules() {
    return this.user['rules']
  },

  ruleSubjects() {
    return _.flatten(_.values(this.rules()))
  },

  ruleKeys() {
    return _.keys(this.rules())
  },

  can(aAction, aSubject) {
    let rules = this.rules()

    return _.includes(rules[aAction], aSubject)
  },

  canReadAll() {
    return this.can('read', 'all')
  },

  canManageAll() {
    return this.can('manage', 'all')
  },

  canRead(aSubject) {
    return this.can('read', aSubject) || this.canReadAll() || this.canManage(aSubject)
  },

  canManage(aSubject) {
    return this.can('manage', aSubject) || this.canManageAll()
  },

  // custom management

  canManageIntegration() {
    return this.isGeneral()
  },

  canStartBidding() {
    return this.isGeneral()
  }
}

export default ability
