defmodule PublicApiTest do
  use ExUnit.Case
  doctest PublicApi

  test "greets the world" do
    assert PublicApi.hello() == :world
  end
end
