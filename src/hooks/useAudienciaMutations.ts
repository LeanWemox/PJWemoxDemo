import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import type { Audiencia } from '../data/types/audiencia'
import type { SqlServerService } from '../data/sql/sqlServerService'

export function useAudienciaMutations(service: SqlServerService) {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: (
      values: Partial<Omit<Audiencia, 'IdAudiencia'>>,
    ) => service.createAudiencia(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['audiencias'] })
    },
  })

  const update = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number
      values: Partial<Audiencia>
    }) => service.updateAudiencia(id, values),
    onSuccess: async (_audiencia, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['audiencias'] }),
        queryClient.invalidateQueries({
          queryKey: ['audiencia', Number(variables.id)],
        }),
      ])
    },
  })

  return { create, update }
}

