import { useEffect, useState } from 'react'
import {User, Mail, Shield, Edit3, Camera, LogOut, Swords, Users, Gamepad2, Crown, Check, X, Save,} from 'lucide-react'
import { getProfile, updateProfile, updateMasterStatus } from '../services/profileService'
import '../styles/profile.css'
import { UserProfile } from '../types/types'
import { useAuth } from '../context/AuthContext'

const defaultProfile: UserProfile = {
  uid: '',
  name: 'Aventureiro',
  email: '',
  bio: 'Ainda não adicionou uma biografia.',
  avatar: '',
  isMaster: false,
  charactersCount: 0,
  partiesCreated: 0,
  partiesJoined: 0,
}

export default function Profile() {
  const { user, logout } = useAuth()
  
  const [profile, setProfile] =
    useState<UserProfile>(defaultProfile)

  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    loadProfile()
  }, [user])
  
  async function loadProfile() {
    if (!user) return

    try {
      const data = await getProfile(user)

      console.log('USER DO AUTH:', user)
      console.log('PERFIL DA API:', data)

      const authUser = user as any

      const authName =
        authUser.displayName ||
        authUser.display_name ||
        authUser.name ||
        authUser.username ||
        ''

      const authEmail =
        authUser.email ||
        ''

      const authAvatar =
        authUser.photoURL ||
        authUser.photo_url ||
        authUser.avatar ||
        ''

      setProfile({
        ...data,

        uid:
          data.uid ||
          authUser.uid ||
          '',

        name:
          data.name &&
          data.name !== 'Aventureiro'
            ? data.name
            : authName || 'Aventureiro',

        email:
          data.email ||
          authEmail,

        avatar:
          data.avatar ||
          authAvatar,
      })

    } catch (error) {
      console.error(
        'Erro ao carregar perfil:',
        error
      )

      const authUser = user as any

      setProfile({
        ...defaultProfile,

        uid: authUser.uid || '',

        name:
          authUser.displayName ||
          authUser.display_name ||
          authUser.name ||
          authUser.username ||
          'Aventureiro',

        email:
          authUser.email ||
          '',

        avatar:
          authUser.photoURL ||
          authUser.photo_url ||
          authUser.avatar ||
          '',
      })
    }
  }

  function startEditing() {
    setEditName(profile.name)
    setEditBio(profile.bio)
    setEditing(true)
  }

  function cancelEditing() {
    setEditing(false)
    setEditName('')
    setEditBio('')
  }

  async function saveProfile() {
    if (!user || !editName.trim()) {
      return
    }

    try {
      setSaving(true)

      const updated = await updateProfile(
        user,
        {
          name: editName.trim(),
          bio: editBio.trim() || 'Ainda não adicionou uma biografia.',
        }
      )

      setProfile(updated)
      setEditing(false)

    } catch (error) {
      console.error(
        'Erro ao salvar perfil:',
        error
      )
    } finally {
      setSaving(false)
    }
  }

  async function toggleMaster() {
    if (!user) return

    try {
      const newStatus = !profile.isMaster

      const updated =
        await updateMasterStatus(
          user,
          newStatus
        )

      setProfile(updated)

    } catch (error) {
      console.error(
        'Erro ao alterar modo Mestre:',
        error
      )
    }
  }

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error(
        'Erro ao sair:',
        error
      )
    }
  }

  return (
    <main className="profile-page">

      {/* HEADER */}

      <div className="profile-page-header">

        <div>
          <span className="page-label">
            <User size={13} />
            Meu perfil
          </span>

          <h1>
            Seu perfil de aventureiro
          </h1>

          <p>
            Gerencie suas informações,
            personagens e participação
            nas aventuras.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={startEditing}
        >
          <Edit3 size={16} />
          Editar perfil
        </button>

      </div>


      {/* PROFILE HERO */}

      <section className="profile-hero">

        <div className="profile-avatar-container">

          <div className="profile-avatar">

            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
              />
            ) : (
              <User size={48} />
            )}

          </div>

          <button
            className="avatar-edit-button"
            title="Alterar foto"
          >
            <Camera size={15} />
          </button>

        </div>


        <div className="profile-main-info">

          <div className="profile-name-row">

            <h2>
              {profile.name}
            </h2>

            {profile.isMaster && (
              <span className="master-badge">
                <Crown size={12} />
                Mestre
              </span>
            )}

          </div>

          <div className="profile-email">

            <Mail size={14} />

            {profile.email || 'E-mail não informado'}

          </div>

          <p className="profile-bio">
            {profile.bio}
          </p>

        </div>

      </section>


      {/* STATS */}

      <section className="profile-stats">

        <div className="profile-stat">

          <div className="profile-stat-icon">
            <Swords size={18} />
          </div>

          <div>
            <strong>
              {profile.charactersCount}
            </strong>

            <span>
              Personagens
            </span>
          </div>

        </div>


        <div className="profile-stat">

          <div className="profile-stat-icon">
            <Crown size={18} />
          </div>

          <div>
            <strong>
              {profile.partiesCreated}
            </strong>

            <span>
              Partys criadas
            </span>
          </div>

        </div>


        <div className="profile-stat">

          <div className="profile-stat-icon">
            <Users size={18} />
          </div>

          <div>
            <strong>
              {profile.partiesJoined}
            </strong>

            <span>
              Partys participadas
            </span>
          </div>

        </div>


        <div className="profile-stat">

          <div className="profile-stat-icon">
            <Gamepad2 size={18} />
          </div>

          <div>
            <strong>
              {profile.partiesCreated +
                profile.partiesJoined}
            </strong>

            <span>
              Aventuras
            </span>
          </div>

        </div>

      </section>


      {/* CONTENT */}

      <div className="profile-content">

        {/* ACCOUNT */}

        <section className="profile-card">

          <div className="profile-card-header">

            <div>
              <span className="profile-card-label">
                Conta
              </span>

              <h3>
                Informações pessoais
              </h3>
            </div>

          </div>


          <div className="profile-info-list">

            <div className="profile-info-item">

              <div className="profile-info-icon">
                <User size={17} />
              </div>

              <div>
                <span>
                  Nome
                </span>

                <strong>
                  {profile.name}
                </strong>
              </div>

            </div>


            <div className="profile-info-item">

              <div className="profile-info-icon">
                <Mail size={17} />
              </div>

              <div>
                <span>
                  E-mail
                </span>

                <strong>
                  {profile.email ||
                    'Não informado'}
                </strong>
              </div>

            </div>


            <div className="profile-info-item">

              <div className="profile-info-icon">
                <Shield size={17} />
              </div>

              <div>
                <span>
                  Tipo de usuário
                </span>

                <strong>
                  {profile.isMaster
                    ? 'Mestre'
                    : 'Player'}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* MASTER */}

        <section className="profile-card master-card">

          <div className="profile-card-header">

            <div className="master-title">

              <div className="master-icon">
                <Crown size={19} />
              </div>

              <div>

                <span className="profile-card-label">
                  Função
                </span>

                <h3>
                  Modo Mestre
                </h3>

              </div>

            </div>

            <button
              className={
                profile.isMaster
                  ? 'master-toggle active'
                  : 'master-toggle'
              }
              onClick={toggleMaster}
              aria-label="Alternar modo mestre"
            >
              <span />
            </button>

          </div>


          <p className="master-description">

            {profile.isMaster
              ? 'Você está no modo Mestre. Ao criar uma nova party, você será responsável por controlar a aventura.'
              : 'Ative o modo Mestre quando quiser criar e controlar suas próprias aventuras.'}

          </p>


          <div
            className={
              profile.isMaster
                ? 'master-status enabled'
                : 'master-status'
            }
          >

            {profile.isMaster ? (
              <>
                <Check size={15} />
                Você está ativo como Mestre
              </>
            ) : (
              <>
                <X size={15} />
                Você está como Player
              </>
            )}

          </div>

        </section>


        {/* DANGER */}

        <section className="profile-card danger-card">

          <div>

            <span className="profile-card-label">
              Sessão
            </span>

            <h3>
              Sair da conta
            </h3>

            <p>
              Encerra sua sessão neste
              dispositivo.
            </p>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sair
          </button>

        </section>

      </div>


      {/* EDIT MODAL */}

      {editing && (

        <div className="modal-overlay">

          <div className="profile-edit-modal">

            <div className="modal-header">

              <div>

                <span className="page-label">
                  Perfil
                </span>

                <h2>
                  Editar perfil
                </h2>

              </div>

              <button
                onClick={cancelEditing}
              >
                <X size={18} />
              </button>

            </div>


            <div className="profile-edit-content">

              <label>
                Nome

                <input
                  type="text"
                  value={editName}
                  onChange={(event) =>
                    setEditName(
                      event.target.value
                    )
                  }
                  placeholder="Seu nome"
                  maxLength={50}
                />

              </label>


              <label>
                Biografia

                <textarea
                  value={editBio}
                  onChange={(event) =>
                    setEditBio(
                      event.target.value
                    )
                  }
                  placeholder="Conte um pouco sobre você..."
                  maxLength={300}
                />

              </label>

            </div>


            <div className="modal-footer">

              <button
                className="secondary-button"
                onClick={cancelEditing}
                disabled={saving}
              >
                Cancelar
              </button>

              <button
                className="primary-button"
                onClick={saveProfile}
                disabled={
                  saving ||
                  !editName.trim()
                }
              >
                <Save size={15} />

                {saving
                  ? 'Salvando...'
                  : 'Salvar alterações'}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  )
}