@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <file-upload _t="{{ csrf_token() }}"></file-upload>
    </div>
</div>
@endsection
