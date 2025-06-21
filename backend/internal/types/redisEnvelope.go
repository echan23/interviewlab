package types

type RedisEnvelope struct{
	Origin string
	Edits []Edit
}