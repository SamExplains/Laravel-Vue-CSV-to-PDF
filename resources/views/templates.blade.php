@extends('layouts.app')
@section('content')
    <templates api_key="{{ config('yandex.api_key') }}"/>
@endsection
