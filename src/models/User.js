export class User {
  constructor({ id, name, email, avatarUrl = null, phone = null, bio = null, created_at = null, updated_at = null, ...rest } = {}) {
    this.id = id ?? rest.userId ?? null;
    this.name = name ?? '';
    this.email = email ?? '';
    this.avatarUrl = avatarUrl ?? rest.avatar_url ?? rest.avatar ?? null;
    this.phone = phone ?? rest.phone_number ?? null;
    this.bio = bio ?? rest.about ?? null;
    this.created_at = created_at ?? rest.createdAt ?? null;
    this.updated_at = updated_at ?? rest.updatedAt ?? null;
    // keep any extra fields for compatibility
    this._extra = rest;
  }

  static fromJSON(json) {
    if (!json || typeof json !== 'object') return new User();
    return new User(json);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatarUrl: this.avatarUrl,
      phone: this.phone,
      bio: this.bio,
      created_at: this.created_at,
      updated_at: this.updated_at,
      ...this._extra,
    };
  }
}
