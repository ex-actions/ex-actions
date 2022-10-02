defmodule ErlangLib do
  @moduledoc """
  Documentation for `ErlangLib`.
  """

  @doc """
  Hello world.

  ## Examples

      iex> ErlangLib.hello()
      :world

  """
  defdelegate hello(), to: :erlang_lib
end
